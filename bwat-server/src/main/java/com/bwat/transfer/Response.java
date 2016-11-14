package com.bwat.transfer;

import lombok.Builder;
import lombok.Data;

/**
 * Created by ugur.hicyilmam on 17.10.2016.
 */
@Builder
@Data
public class Response {
    private String status;
    private Object data;
    private Object errors;
    private Object error;
}
