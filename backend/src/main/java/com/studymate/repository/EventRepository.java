package com.studymate.repository;

import com.studymate.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    
    // NEW: Find events by subject
    List<Event> findBySubjectContainingIgnoreCase(String subject);
    
    // NEW: Find events by type
    List<Event> findByEventType(String eventType);
    
    // NEW: Find events for today
    @Query("SELECT e FROM Event e WHERE DATE(e.eventDate) = CURRENT_DATE ORDER BY e.eventDate ASC")
    List<Event> findTodayEvents();
    
    // NEW: Find events for this week
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN ?1 AND ?2 ORDER BY e.eventDate ASC")
    List<Event> findThisWeekEvents(LocalDateTime startOfWeek, LocalDateTime endOfWeek);
}