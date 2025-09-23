package com.bankofabyssinia.assembly_vote_service.Exception;

public class PositionNotFoundException extends RuntimeException {
    public PositionNotFoundException(String message) {
        super(message);
    }
}