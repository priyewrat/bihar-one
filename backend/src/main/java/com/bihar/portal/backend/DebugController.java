package com.bihar.portal.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private String port;

    @GetMapping("/debug-mail")
    public String debugMail() {
        return "HOST=" + host + ", PORT=" + port;
    }
}