package com.bankofabyssinia.assembly.controller;

import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly.model.ShareHolderDetailForPrint;
import com.bankofabyssinia.assembly.repo.ShareHolderDetailForPrintRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api")
public class ShareHolderDetailForPrintController {

    // Add endpoint methods here
    @Autowired
    public ShareHolderDetailForPrintRepository repository;


    // Renamed to avoid mapping conflict with ContentController
    @GetMapping("/admin/printphone/{phone}")
    public List<ShareHolderDetailForPrint> findByPhoneStartsWithPrint(@PathVariable String phone) {
        return repository.findByPhoneStartsWith(phone);
    }

    @GetMapping("/admin/printname/{name}")
    public List<ShareHolderDetailForPrint> findByNameengStartsWithPrint(@PathVariable String name) {
        return repository.findByNameengStartsWith(name);
    }

    @GetMapping("/admin/printshareid/{shareid}")
    public List<ShareHolderDetailForPrint> findByShareholderidPrint(@PathVariable String shareid) {
        return repository.findByShareholderid(shareid);
    }


    @GetMapping("/admin/printperson/{id}")
    public Optional<ShareHolderDetailForPrint> findByPersonIdPrint(@PathVariable Long id) {
        return repository.findById(id);
    }
    

}