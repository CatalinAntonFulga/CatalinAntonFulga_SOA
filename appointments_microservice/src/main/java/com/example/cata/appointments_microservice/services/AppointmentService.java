package com.example.cata.appointments_microservice.services;

import com.example.cata.appointments_microservice.entities.Appointment;

import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    List<Appointment> getAllAppointments();

    List<Appointment> getAllAppointmentsOrdered();

    List<Appointment> getAppointmentsByPatient(String name);

    List<Appointment> getAppointmentByDoctor(String name);

    List<Appointment> getAppointmentsByPatientOrdered(String name);

    List<Appointment> getAppointmentByDoctorOrdered(String name);

    Optional<Appointment> getAppointmentById(Integer id);

    void addAppointment(Appointment appointment);

    void updateAppointment(Integer id, Appointment appointment);

    void deleteAppointment(Appointment appointment);
}
