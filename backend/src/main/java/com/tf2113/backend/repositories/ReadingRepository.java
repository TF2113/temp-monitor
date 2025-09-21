package com.tf2113.backend.repositories;

import com.tf2113.backend.domain.entities.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, UUID> {

    @Query("SELECT AVG(r.temperature) from Reading r WHERE r.timestamp >= :start")
    Double findAverageTempSince(@Param("start") LocalDateTime start);

    @Query("SELECT AVG(r.humidity) from Reading r WHERE r.timestamp >= :start")
    Double findAverageHumSince(@Param("start") LocalDateTime start);

    @Query("SELECT AVG(r.pressure) from Reading r WHERE r.timestamp >= :start")
    Double findAveragePressureSince(@Param("start") LocalDateTime start);
}
