package com.bwat.transfer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldErrorData {
    private String fieldName;
    private String rejectedValue;
    private String message;
}
