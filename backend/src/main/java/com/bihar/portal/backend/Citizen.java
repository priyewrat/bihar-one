package com.bihar.portal.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "citizen")
public class Citizen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "aadhar_number", nullable = false, unique = true)
    private String aadharNumber;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean verified = false;

    // ✅ New fields
    @Column(name = "father_name", nullable = false)
    private String fatherName;

    @Column(name = "mother_name", nullable = false)
    private String motherName;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String subdivision;

    @Column(nullable = false)
    private String block;

    @Column(nullable = false)
    private String village;

    @Column(name = "post_office", nullable = false)
    private String postOffice;

    @Column(name = "police_station", nullable = false)
    private String policeStation;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private String role = "CITIZEN";

    public Citizen() {}

    public Citizen(String name, String email, String password, String aadharNumber,
                   String phoneNumber, String fatherName, String motherName,
                   String gender, String state, String district, String subdivision,
                   String block, String village, String postOffice, String policeStation,
                   String pincode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.aadharNumber = aadharNumber;
        this.phoneNumber = phoneNumber;
        this.verified = false;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.gender = gender;
        this.state = state;
        this.district = district;
        this.subdivision = subdivision;
        this.block = block;
        this.village = village;
        this.postOffice = postOffice;
        this.policeStation = policeStation;
        this.pincode = pincode;
    }

    // 👉 Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getSubdivision() { return subdivision; }
    public void setSubdivision(String subdivision) { this.subdivision = subdivision; }

    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getPostOffice() { return postOffice; }
    public void setPostOffice(String postOffice) { this.postOffice = postOffice; }

    public String getPoliceStation() { return policeStation; }
    public void setPoliceStation(String policeStation) { this.policeStation = policeStation; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
