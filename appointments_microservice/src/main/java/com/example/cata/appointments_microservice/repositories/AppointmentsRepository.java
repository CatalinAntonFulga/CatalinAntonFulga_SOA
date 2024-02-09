package com.example.cata.appointments_microservice.repositories;

import com.example.cata.appointments_microservice.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentsRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPatient(String patient);
    List<Appointment> findByDoctor(String doctor);
    List<Appointment> findAllByOrderByTimestampAsc();
    List<Appointment> findByPatientOrderByTimestampAsc(String patient);
    List<Appointment> findByDoctorOrderByTimestampAsc(String doctor);
}
