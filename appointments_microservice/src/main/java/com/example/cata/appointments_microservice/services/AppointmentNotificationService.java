package com.example.cata.appointments_microservice.services;

import com.example.cata.appointments_microservice.events.AppointmentEvent;

public interface AppointmentNotificationService {
    public void listen(AppointmentEvent event);
}
