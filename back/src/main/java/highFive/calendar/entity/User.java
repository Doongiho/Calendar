package highFive.calendar.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(length = 30, nullable = false,unique = true)
    private String email;

    @Column(length = 20, nullable = false)
    private String pwd;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(nullable = false)
    private int gender;
}
