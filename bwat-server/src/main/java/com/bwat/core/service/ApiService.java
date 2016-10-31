package com.bwat.core.service;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    @POST("annotation")
    Call<Object> addAnnotation(@Body Object object);
}
