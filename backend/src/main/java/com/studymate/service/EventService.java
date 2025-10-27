package com.studymate.service;

import com.studymate.model.Event;
import com.studymate.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Event name cannot be empty");
        }
        
        if (event.getEventDate() == null) {
            throw new IllegalArgumentException("Event date is required");
        }
        
        // Set default values for new fields if not provided
        if (event.getEventType() == null) {
            event.setEventType("STUDY");
        }
        
        if (event.getDuration() == null) {
            event.setDuration(60); // Default 60 minutes
        }
        
        if (event.getPriority() == null) {
            event.setPriority(3); // Default medium priority
        }
        
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setName(eventDetails.getName());
            event.setEventDate(eventDetails.getEventDate());
            event.setDescription(eventDetails.getDescription());
            event.setSubject(eventDetails.getSubject());
            event.setEventType(eventDetails.getEventType());
            event.setDuration(eventDetails.getDuration());
            event.setPriority(eventDetails.getPriority());
            
            return eventRepository.save(event);
        }
        return null;
    }

    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now());
    }

    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByEventDateBetween(start, end);
    }
    
    // NEW METHODS
    public List<Event> getEventsBySubject(String subject) {
        return eventRepository.findBySubjectContainingIgnoreCase(subject);
    }
    
    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType);
    }
    
    public List<Event> getTodayEvents() {
        return eventRepository.findTodayEvents();
    }
    
    public List<Event> getThisWeekEvents() {
        LocalDateTime startOfWeek = LocalDateTime.now().with(java.time.DayOfWeek.MONDAY).withHour(0).withMinute(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return eventRepository.findThisWeekEvents(startOfWeek, endOfWeek);
    }
}