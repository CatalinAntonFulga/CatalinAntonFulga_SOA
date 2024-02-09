package com.example.cata.user_microservice.rabbitmq;

import com.example.cata.user_microservice.events.UserChangeEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UserChangeConsumer {

    @RabbitListener(queues = "admin_notif")
    public void consumeMessage(UserChangeEvent event) {
        System.out.println("Received User Change Event: " + event.getUsername() + ", Pass: " + event.getPassword() + ", Email: " + event.getEmail());
    }
}
