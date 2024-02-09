package com.example.cata.appointments_microservice.events;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class AppointmentEvent {
    private Integer id;
    private String patient;
    private String doctor;
    private String description;
    private Date timestamp;
    private String message;

    public AppointmentEvent(Integer id, String patient, String doctor, String description, Date timestamp, String message) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.description = description;
        this.timestamp = timestamp;
        this.message = message;
    }
}
