package com.bwat.transfer;

import lombok.Data;

@Data
public class Target {
    private String source;
    private String id;
    private String format;
    private String type;
    private Object selector;
}
