package com.bankofabyssinia.assembly.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bankofabyssinia.assembly.model.Assembly;
import com.bankofabyssinia.assembly.repo.AssemblyRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



@Service
public class AssemblyService {

    @Autowired
    private AssemblyRepository assemblyRepository;

    // Create Assembly
    public Assembly createAssembly(Assembly assembly) {
        Assembly entity = new Assembly();
        entity.setName(assembly.getName());
        entity.setDescription(assembly.getDescription());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setAssemblyDay(assembly.getAssemblyDay());
        // set other fields as needed
        return assemblyRepository.save(entity);
    }

    // Get all Assemblies
    public List<Assembly> getAllAssemblies() {
        return assemblyRepository.findAll();
    }

    // Get Assembly by ID
    public Optional<Assembly> getAssemblyById(Long id) {
        return assemblyRepository.findById(id);
    }

    // Update Assembly
    public Optional<Assembly> updateAssembly(Long id, Assembly assembly) {
        Optional<Assembly> optionalEntity = assemblyRepository.findById(id);
        if (optionalEntity.isPresent()) {
            Assembly entity = optionalEntity.get();
            entity.setName(assembly.getName());
            entity.setDescription(assembly.getDescription());
            entity.setAssemblyDay(assembly.getAssemblyDay());
            entity.setUpdatedAt(LocalDateTime.now());
            // update other fields as needed
            return Optional.of(assemblyRepository.save(entity));
        }
        return Optional.empty();
    }

    // Delete Assembly
    public boolean deleteAssembly(Long id) {
        if (assemblyRepository.existsById(id)) {
            assemblyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}