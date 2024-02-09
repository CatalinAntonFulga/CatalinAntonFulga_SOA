package com.example.cata.appointments_microservice.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String patient;
    @Column(nullable = false)
    private String doctor;
    @Column(length = 2000)
    private String description;
    private Date timestamp;
    private String address;

    public Appointment(String patient, String doctor, String description, Date timestamp, String address) {
        this.patient = patient;
        this.doctor = doctor;
        this.description = description;
        this.timestamp = timestamp;
        this.address = address;
    }
}
