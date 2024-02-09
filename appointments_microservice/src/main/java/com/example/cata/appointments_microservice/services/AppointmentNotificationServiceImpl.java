package com.example.cata.appointments_microservice.services;

import com.example.cata.appointments_microservice.controller.WebSocketNotificationController;
import com.example.cata.appointments_microservice.events.AppointmentEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AppointmentNotificationServiceImpl implements AppointmentNotificationService{
    @Autowired
    private RestTemplate restTemplate;
    private WebSocketNotificationController notificationController;

    @Override
    @KafkaListener(topics = "appointment-events", groupId = "appointment-group")
    public void listen(AppointmentEvent event) {

        System.out.println("Received Kafka message: " + event.getMessage());

        notificationController.notifyDoctorAndPatient(event.getPatient(), event.getDoctor(), "Appointment update: " + event.getMessage());
    }
}
