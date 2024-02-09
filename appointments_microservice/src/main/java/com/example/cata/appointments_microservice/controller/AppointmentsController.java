package com.example.cata.appointments_microservice.controller;

import com.example.cata.appointments_microservice.entities.Appointment;
import com.example.cata.appointments_microservice.events.AppointmentEvent;
import com.example.cata.appointments_microservice.services.AppointmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentsController {

    private final AppointmentService appointmentService;
    private RestTemplate restTemplate;
    private final KafkaTemplate<String, AppointmentEvent> kafkaTemplate;
    private static final String TOPIC = "appointment-events";

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/ordered")
    public ResponseEntity<List<Appointment>> getAllAppointmentsOrdered() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsOrdered());
    }

    @GetMapping("/by-patient")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(name));
    }

    @GetMapping("/by-doctor")
    public ResponseEntity<List<Appointment>> getAppointmentByDoctor(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.getAppointmentByDoctor(name));
    }

    @GetMapping("/by-patient/ordered")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientOrdered(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientOrdered(name));
    }

    @GetMapping("/by-doctor/ordered")
    public ResponseEntity<List<Appointment>> getAppointmentByDoctorOrdered(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.getAppointmentByDoctorOrdered(name));
    }

    @GetMapping("/id")
    public ResponseEntity<Appointment> getAppointmentById(@RequestParam Integer id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Appointment> addAppointment(@RequestParam String patient, @RequestParam String doctor, @RequestParam String description, @RequestParam Date timestamp, @RequestParam String address) throws JsonProcessingException {
        Appointment appointment = new Appointment(patient, doctor, description, timestamp, address);
        appointmentService.addAppointment(appointment);

        AppointmentEvent event = new AppointmentEvent(appointment.getId(), appointment.getPatient(), appointment.getDoctor(), appointment.getDescription(), appointment.getTimestamp(), "Appointment Added");
        kafkaTemplate.send(TOPIC, event);

        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    @PutMapping("/update")
    public ResponseEntity<Appointment> updateAppointment(@RequestParam Integer id, @RequestBody Appointment appointment) {
        Optional<Appointment> existingAppointment = appointmentService.getAppointmentById(id);
        if(existingAppointment.isPresent()) {
            Appointment updatedAppointment = existingAppointment.get();
            updatedAppointment.setPatient(appointment.getPatient());
            updatedAppointment.setDoctor(appointment.getDoctor());
            updatedAppointment.setAddress(appointment.getAddress());
            updatedAppointment.setDescription(appointment.getDescription());
            updatedAppointment.setTimestamp(appointment.getTimestamp());
            appointmentService.updateAppointment(id, updatedAppointment);

            AppointmentEvent event = new AppointmentEvent(appointment.getId(), appointment.getPatient(), appointment.getDoctor(), appointment.getDescription(), appointment.getTimestamp(), "Appointment Added");
            kafkaTemplate.send(TOPIC, event);

            return ResponseEntity.ok(updatedAppointment);
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteAppointment(@RequestParam Integer id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent()) {
            Appointment appointment1 = appointment.get();
            appointmentService.deleteAppointment(appointment1);

            AppointmentEvent event = new AppointmentEvent(appointment1.getId(), appointment1.getPatient(), appointment1.getDoctor(), appointment1.getDescription(), appointment1.getTimestamp(), "Appointment Deleted");
            kafkaTemplate.send(TOPIC, event);

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
