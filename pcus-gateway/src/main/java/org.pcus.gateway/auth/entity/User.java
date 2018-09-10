package org.pcus.gateway.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {

    Integer id;
    String name;
    Integer age;
    String address;
}
