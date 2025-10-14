package com.bankofabyssinia.assembly.controller;

import com.bankofabyssinia.assembly.Service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/result")
public class ResultController {
    @Autowired
    private ResultService resultService;
}
