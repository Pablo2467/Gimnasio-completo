package com.gymflow.api.sales;

import com.gymflow.api.inventory.Product;
import com.gymflow.api.inventory.ProductService;
import com.gymflow.api.member.MemberService;
import com.gymflow.api.sales.dto.SaleItemRequest;
import com.gymflow.api.sales.dto.SaleRequest;
import com.gymflow.api.sales.dto.SaleResponse;
import com.gymflow.api.user.Role;
import com.gymflow.api.user.User;
import com.gymflow.api.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository repository;
    @Mock
    private ProductService productService;
    @Mock
    private MemberService memberService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SaleService saleService;

    private User employee;
    private Product product;

    @BeforeEach
    void setUp() {
        employee = User.builder().id(1L).email("admin@gymflow.com").role(Role.ADMIN).build();

        product = Product.builder()
                .id(5L)
                .name("Whey Protein 2lb")
                .price(BigDecimal.valueOf(145000))
                .stock(20)
                .build();

        // Simulamos que hay un usuario autenticado, igual que lo haría JwtAuthFilter en producción
        SecurityContext context = mock(SecurityContext.class);
        var authToken = new UsernamePasswordAuthenticationToken(employee.getEmail(), null, List.of());
        lenient().when(context.getAuthentication()).thenReturn(authToken);
        SecurityContextHolder.setContext(context);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void create_deberiaDescontarStockYCalcularTotal() {
        when(userRepository.findByEmail("admin@gymflow.com")).thenReturn(Optional.of(employee));
        when(productService.getEntity(5L)).thenReturn(product);
        when(repository.save(any(Sale.class))).thenAnswer(inv -> inv.getArgument(0));

        SaleRequest request = new SaleRequest(null, List.of(new SaleItemRequest(5L, 3)));
        SaleResponse response = saleService.create(request);

        assertThat(product.getStock()).isEqualTo(17); // 20 - 3
        assertThat(response.total()).isEqualByComparingTo(BigDecimal.valueOf(435000)); // 145000 * 3
        verify(productService).save(product);
    }

    @Test
    void create_deberiaRechazarSiNoHaySuficienteStock() {
        when(userRepository.findByEmail("admin@gymflow.com")).thenReturn(Optional.of(employee));
        when(productService.getEntity(5L)).thenReturn(product);

        SaleRequest request = new SaleRequest(null, List.of(new SaleItemRequest(5L, 999)));

        assertThatThrownBy(() -> saleService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Stock insuficiente");

        // El stock no debe haber cambiado, y nunca se debe haber guardado la venta
        assertThat(product.getStock()).isEqualTo(20);
        verify(repository, never()).save(any());
    }

    @Test
    void cancel_deberiaDevolverElStock() {
        SaleItem item = SaleItem.builder().product(product).quantity(3).unitPrice(product.getPrice()).build();
        Sale sale = Sale.builder().id(1L).status(SaleStatus.COMPLETED).items(List.of(item)).build();
        product.setStock(17); // como si ya se hubiera descontado antes

        when(repository.findById(1L)).thenReturn(Optional.of(sale));

        saleService.cancel(1L);

        assertThat(product.getStock()).isEqualTo(20); // 17 + 3 devueltos
        assertThat(sale.getStatus()).isEqualTo(SaleStatus.CANCELLED);
        verify(productService).save(product);
    }

    @Test
    void cancel_deberiaRechazarSiLaVentaYaEstaCancelada() {
        Sale sale = Sale.builder().id(1L).status(SaleStatus.CANCELLED).items(List.of()).build();
        when(repository.findById(1L)).thenReturn(Optional.of(sale));

        assertThatThrownBy(() -> saleService.cancel(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("COMPLETED");
    }
}
