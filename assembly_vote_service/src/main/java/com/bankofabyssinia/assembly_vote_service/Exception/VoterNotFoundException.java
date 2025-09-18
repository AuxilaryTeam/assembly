package com.bankofabyssinia.assembly_vote_service.Exception;

public class VoterNotFoundException extends RuntimeException {
    public VoterNotFoundException(String message) {
        super(message);
    }
}
