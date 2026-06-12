package com.bihar.portal.backend;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "residence_certificate")
public class ResidenceCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String fatherName;
    private String motherName;
    private String gender;

    @Column(nullable = false, unique = true)
    private String aadharNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private String mobileNumber;
    private String state;
    private String district;
    private String block;
    private String subDivision;
    private String villageOrTown;
    private String postOffice;
    private String policeStation;
    private String pinCode;

    @Column(nullable = false)
    private String verificationLevel; // BLOCK, SUB_DIVISION, DISTRICT

    @Column(nullable = false, unique = true)
    private String applicationNumber;

    @Lob
    private byte[] photo; // applicant photo

    @Lob
    private byte[] proof; // proof document

    // Workflow fields
    private String status; // PENDING, APPROVED_BY_RO, APPROVED_BY_SDM, REJECTED, CERTIFICATE_ISSUED

    private String certificateNumber; // generated only after final approval

    // Role-specific remarks
    private String boRemark;
    private String foRemark;
    private String roRemark;
    private String sdmRemark;
    private String dmRemark;

    // Workflow dates
    private LocalDateTime appliedDate;
    private String boVerifiedDate;
    private String foVerifiedDate;
    private String roApprovedDate;
    private String sdmApprovedDate;
    private String dmApprovedDate;
    private LocalDateTime certificateIssuedDate;

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAadharNumber() {
        return aadharNumber;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(String subDivision) {
        this.subDivision = subDivision;
    }

    public String getVillageOrTown() {
        return villageOrTown;
    }

    public void setVillageOrTown(String villageOrTown) {
        this.villageOrTown = villageOrTown;
    }

    public String getPostOffice() {
        return postOffice;
    }

    public void setPostOffice(String postOffice) {
        this.postOffice = postOffice;
    }

    public String getPoliceStation() {
        return policeStation;
    }

    public void setPoliceStation(String policeStation) {
        this.policeStation = policeStation;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getVerificationLevel() {
        return verificationLevel;
    }

    public void setVerificationLevel(String verificationLevel) {
        this.verificationLevel = verificationLevel;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public byte[] getProof() {
        return proof;
    }

    public void setProof(byte[] proof) {
        this.proof = proof;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getBoRemark() {
        return boRemark;
    }

    public void setBoRemark(String boRemark) {
        this.boRemark = boRemark;
    }

    public String getFoRemark() {
        return foRemark;
    }

    public void setFoRemark(String foRemark) {
        this.foRemark = foRemark;
    }

    public String getRoRemark() {
        return roRemark;
    }

    public void setRoRemark(String roRemark) {
        this.roRemark = roRemark;
    }

    public String getSdmRemark() {
        return sdmRemark;
    }

    public void setSdmRemark(String sdmRemark) {
        this.sdmRemark = sdmRemark;
    }

    public String getDmRemark() {
        return dmRemark;
    }

    public void setDmRemark(String dmRemark) {
        this.dmRemark = dmRemark;
    }

    public LocalDateTime getAppliedDate() {
      return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
      this.appliedDate = appliedDate;
    }

    public String getBoVerifiedDate() {
        return boVerifiedDate;
    }

    public void setBoVerifiedDate(String boVerifiedDate) {
        this.boVerifiedDate = boVerifiedDate;
    }

    public String getFoVerifiedDate() {
        return foVerifiedDate;
    }

    public void setFoVerifiedDate(String foVerifiedDate) {
        this.foVerifiedDate = foVerifiedDate;
    }

    public String getRoApprovedDate() {
        return roApprovedDate;
    }

    public void setRoApprovedDate(String roApprovedDate) {
        this.roApprovedDate = roApprovedDate;
    }

    public String getSdmApprovedDate() {
        return sdmApprovedDate;
    }

    public void setSdmApprovedDate(String sdmApprovedDate) {
        this.sdmApprovedDate = sdmApprovedDate;
    }

    public String getDmApprovedDate() {
    return dmApprovedDate;
}

    public void setDmApprovedDate(String dmApprovedDate) {
        this.dmApprovedDate = dmApprovedDate;
    }

    public LocalDateTime getCertificateIssuedDate() {
       return certificateIssuedDate;
    }

    public void setCertificateIssuedDate(LocalDateTime certificateIssuedDate) {
      this.certificateIssuedDate = certificateIssuedDate;
    }
}
