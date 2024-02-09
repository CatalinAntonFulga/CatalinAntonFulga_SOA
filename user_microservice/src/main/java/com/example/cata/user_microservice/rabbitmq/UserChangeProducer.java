package com.example.cata.user_microservice.rabbitmq;

import com.example.cata.user_microservice.events.UserChangeEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserChangeProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final String QUEUE_NAME = "admin_notif";

    public void sendMessage(UserChangeEvent event) {
        rabbitTemplate.convertAndSend(QUEUE_NAME, event);
    }
}
