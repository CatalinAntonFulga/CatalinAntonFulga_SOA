package com.example.cata.appointments_microservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketNotificationController {

    @Autowired
    private SimpMessagingTemplate template;

    public void notifyDoctorAndPatient(String patient, String doctor, String content) {
        String message = "Notification for " + doctor + " and " + patient + ": " + content;

        template.convertAndSend("/topic/notifications/doctor/" + doctor, message);
        template.convertAndSend("/topic/notifications/patient/" + patient, message);
    }
}