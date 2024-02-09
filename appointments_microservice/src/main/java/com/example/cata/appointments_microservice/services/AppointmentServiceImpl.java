package com.example.cata.appointments_microservice.services;

import com.example.cata.appointments_microservice.entities.Appointment;
import com.example.cata.appointments_microservice.repositories.AppointmentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService{

    private final AppointmentsRepository appointmentsRepository;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentsRepository.findAll();
    }

    @Override
    public List<Appointment> getAllAppointmentsOrdered() {
        return appointmentsRepository.findAllByOrderByTimestampAsc();
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(String name) {
        return appointmentsRepository.findByPatient(name);
    }

    @Override
    public List<Appointment> getAppointmentByDoctor(String name) {
        return appointmentsRepository.findByDoctor(name);
    }

    @Override
    public List<Appointment> getAppointmentsByPatientOrdered(String name) {
        return appointmentsRepository.findByPatientOrderByTimestampAsc(name);
    }

    @Override
    public List<Appointment> getAppointmentByDoctorOrdered(String name) {
        return appointmentsRepository.findByDoctorOrderByTimestampAsc(name);
    }

    @Override
    public Optional<Appointment> getAppointmentById(Integer id) {
        return appointmentsRepository.findById(id);
    }

    @Override
    public void addAppointment(Appointment appointment) {
        appointmentsRepository.save(appointment);
    }

    @Override
    public void updateAppointment(Integer id, Appointment appointment) {
        Optional<Appointment> existingAppointment = appointmentsRepository.findById(id);
        if(existingAppointment.isPresent()) {
            appointmentsRepository.save(appointment);
        }
    }

    @Override
    public void deleteAppointment(Appointment appointment) {
        appointmentsRepository.delete(appointment);
    }
}
