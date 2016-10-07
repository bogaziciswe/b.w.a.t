package com.bwat.core.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueMailValidator.class)
@ReportAsSingleViolation
public @interface UniqueMail {

    String message() default "{UniqueMail}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
