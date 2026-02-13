package com.javaecommerce.config;

import com.javaecommerce.entity.*;
import com.javaecommerce.repository.CategoryRepository;
import com.javaecommerce.repository.ProductRepository;
import com.javaecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String IMG_STRAT_1   = "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_STRAT_2   = "https://images.unsplash.com/photo-1556449895-a33c9dba33dd?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_STRAT_3   = "https://images.unsplash.com/photo-1519160558534-579f5106e43f?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_LP_1      = "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_LP_2      = "https://images.unsplash.com/photo-1605020420620-20c943cc4669?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_TELE_1    = "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_TELE_2    = "https://images.unsplash.com/photo-1571974599782-87624638275a?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_SG_1      = "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_SG_2      = "https://images.unsplash.com/photo-1535083252457-6395c7081320?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_SUPER_1   = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_SUPER_2   = "https://images.unsplash.com/photo-1556379118-7034d926d258?auto=format&fit=crop&w=900&q=80";
    private static final String IMG_SUPER_3   = "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80";

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCustomer();
        if (productRepository.count() == 0) {
            seedCatalog();
        }
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@guitarshop.com")) return;
        User admin = User.builder()
                .email("admin@guitarshop.com")
                .password(passwordEncoder.encode("admin12345"))
                .firstName("Store")
                .lastName("Admin")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        admin.setCart(Cart.builder().user(admin).build());
        userRepository.save(admin);
        log.info("Seeded admin: admin@guitarshop.com / admin12345");
    }

    private void seedCustomer() {
        if (userRepository.existsByEmail("customer@guitarshop.com")) return;
        User c = User.builder()
                .email("customer@guitarshop.com")
                .password(passwordEncoder.encode("customer12345"))
                .firstName("Demo")
                .lastName("Customer")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        c.setCart(Cart.builder().user(c).build());
        userRepository.save(c);
        log.info("Seeded customer: customer@guitarshop.com / customer12345");
    }

    private void seedCatalog() {
        Category strat = upsertCategory("Stratocaster",
                "Double-cutaway, three single-coil pickups, classic bright tone.",
                IMG_STRAT_1);
        Category lp = upsertCategory("Les Paul",
                "Single-cutaway, mahogany body, dual humbuckers, thick warm tone.",
                IMG_LP_1);
        Category tele = upsertCategory("Telecaster",
                "Solid body, twangy and articulate, country and rock staple.",
                IMG_TELE_1);
        Category sg = upsertCategory("SG",
                "Lightweight mahogany body, double cutaway, aggressive humbucker tone.",
                IMG_SG_1);
        Category superstrat = upsertCategory("Superstrat",
                "High-output pickups, fast necks, built for shred and modern metal.",
                IMG_SUPER_1);

        productRepository.saveAll(List.of(
                guitar("Fender American Professional II Stratocaster", "Fender", "0113900706", strat,
                        new BigDecimal("1899.00"), 8, "Olympic White", "Alder", "Maple", "Rosewood", "SSS",
                        IMG_STRAT_3,
                        "Workhorse Strat with V-Mod II single-coils, Deep C neck and rolled fingerboard edges."),
                guitar("Fender Player Stratocaster HSS", "Fender", "0144523506", strat,
                        new BigDecimal("899.00"), 15, "3-Color Sunburst", "Alder", "Maple", "Pau Ferro", "HSS",
                        IMG_STRAT_2,
                        "Modern Player series HSS with Player Series Alnico V pickups and 2-point tremolo."),
                guitar("Squier Classic Vibe '50s Stratocaster", "Squier", "0374005506", strat,
                        new BigDecimal("499.00"), 25, "2-Color Sunburst", "Pine", "Maple", "Maple", "SSS",
                        IMG_STRAT_1,
                        "Vintage-style Strat with Fender-designed alnico pickups and slim '50s C neck."),

                guitar("Gibson Les Paul Standard '60s", "Gibson", "LPS600HCNH1", lp,
                        new BigDecimal("2799.00"), 6, "Bourbon Burst", "Mahogany w/ Maple top", "Mahogany", "Rosewood", "HH",
                        IMG_LP_1,
                        "Classic '60s Burstbucker 61R/61T pickups, SlimTaper neck, AAA flame maple top."),
                guitar("Epiphone Les Paul Standard '50s", "Epiphone", "EILS5HSNH1", lp,
                        new BigDecimal("699.00"), 18, "Heritage Cherry Sunburst", "Mahogany w/ Maple top", "Mahogany", "Indian Laurel", "HH",
                        IMG_LP_2,
                        "Affordable Les Paul with ProBucker pickups, '50s rounded neck and CTS pots."),

                guitar("Fender American Pro II Telecaster", "Fender", "0113942700", tele,
                        new BigDecimal("1799.00"), 7, "Butterscotch Blonde", "Ash", "Maple", "Maple", "SS",
                        IMG_TELE_1,
                        "V-Mod II single-coils, treble-bleed circuit and compound-radius fingerboard."),
                guitar("Fender Player Telecaster", "Fender", "0145212500", tele,
                        new BigDecimal("849.00"), 14, "Black", "Alder", "Maple", "Maple", "SS",
                        IMG_TELE_2,
                        "Solid alder body, Player Alnico V Tele pickups, modern C neck profile."),

                guitar("Gibson SG Standard", "Gibson", "SGS00HCCH1", sg,
                        new BigDecimal("1799.00"), 5, "Heritage Cherry", "Mahogany", "Mahogany", "Rosewood", "HH",
                        IMG_SG_1,
                        "Lightweight mahogany SG with 490R/490T humbuckers and rounded neck profile."),
                guitar("Epiphone SG Special", "Epiphone", "EGS1VECH1", sg,
                        new BigDecimal("349.00"), 22, "Vintage Cherry", "Mahogany", "Mahogany", "Indian Laurel", "HH",
                        IMG_SG_2,
                        "Entry SG with Epiphone Ceramic Pro humbuckers, lightweight body and SlimTaper D neck."),

                guitar("Ibanez RG550 Genesis Collection", "Ibanez", "RG550DY", superstrat,
                        new BigDecimal("1199.00"), 9, "Desert Sun Yellow", "Basswood", "Maple", "Maple", "HSH",
                        IMG_SUPER_3,
                        "Genesis reissue: Wizard neck, V7/S1/V8 pickups and Edge tremolo bridge."),
                guitar("Jackson Pro Plus Soloist SLA3", "Jackson", "2914327503", superstrat,
                        new BigDecimal("1499.00"), 5, "Deep Black Satin", "Mahogany", "Maple", "Ebony", "HH",
                        IMG_SUPER_1,
                        "Through-body neck, Seymour Duncan JB/Jazz, Floyd Rose 1500 Series tremolo."),
                guitar("ESP LTD M-1000 Evertune", "ESP", "LM1000ETHTM", superstrat,
                        new BigDecimal("1399.00"), 4, "Charcoal Metallic Satin", "Mahogany", "Maple", "Macassar Ebony", "HH",
                        IMG_SUPER_2,
                        "Evertune bridge, Fishman Fluence Modern pickups, perfect tuning under any tension.")
        ));
        log.info("Seeded {} categories and {} guitars", categoryRepository.count(), productRepository.count());
    }

    private Category upsertCategory(String name, String description, String imageUrl) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name).description(description).imageUrl(imageUrl).build()));
    }

    private Product guitar(String name, String brand, String code, Category cat,
                           BigDecimal price, int stock, String color, String body, String neck,
                           String fb, String pickups, String img, String desc) {
        return Product.builder()
                .name(name).brand(brand).modelCode(code).category(cat)
                .price(price).stock(stock).color(color)
                .bodyWood(body).neckWood(neck).fingerboard(fb).pickupConfig(pickups)
                .imageUrl(img).description(desc).active(true)
                .build();
    }
}
