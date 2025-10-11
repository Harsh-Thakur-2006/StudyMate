package com.studymate.repository;

import com.studymate.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by date range
    List<Event> findByEventDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Find upcoming events
    List<Event> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);
    
    // Find events by name containing (case insensitive)
    List<Event> findByNameContainingIgnoreCase(String name);
}