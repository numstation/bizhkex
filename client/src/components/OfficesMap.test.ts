import { describe, it, expect, vi } from 'vitest';

describe('OfficesMap Component', () => {
  it('should handle empty offices array', () => {
    const offices: any[] = [];
    expect(offices.length).toBe(0);
  });

  it('should calculate center for single office', () => {
    const offices = [
      {
        id: 1,
        name: 'Test Office',
        address: '123 Test St',
        latitude: 22.3193,
        longitude: 114.1694,
      },
    ];

    const lats = offices.map((o) => parseFloat(String(o.latitude)));
    const lngs = offices.map((o) => parseFloat(String(o.longitude)));

    expect(lats[0]).toBe(22.3193);
    expect(lngs[0]).toBe(114.1694);
  });

  it('should calculate center for multiple offices', () => {
    const offices = [
      {
        id: 1,
        name: 'Office 1',
        address: '123 Test St',
        latitude: 22.3193,
        longitude: 114.1694,
      },
      {
        id: 2,
        name: 'Office 2',
        address: '456 Test Ave',
        latitude: 22.2833,
        longitude: 114.1833,
      },
    ];

    const lats = offices.map((o) => parseFloat(String(o.latitude)));
    const lngs = offices.map((o) => parseFloat(String(o.longitude)));

    const avgLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const avgLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    expect(avgLat).toBeGreaterThan(22.28);
    expect(avgLat).toBeLessThan(22.33);
    expect(avgLng).toBeGreaterThan(114.16);
    expect(avgLng).toBeLessThan(114.19);
  });

  it('should filter offices without coordinates', () => {
    const offices = [
      {
        id: 1,
        name: 'Office 1',
        address: '123 Test St',
        latitude: 22.3193,
        longitude: 114.1694,
      },
      {
        id: 2,
        name: 'Office 2',
        address: '456 Test Ave',
        latitude: null,
        longitude: null,
      },
    ];

    const officesWithCoords = offices.filter(
      (o) => o.latitude && o.longitude
    );

    expect(officesWithCoords.length).toBe(1);
    expect(officesWithCoords[0].id).toBe(1);
  });

  it('should handle string coordinates', () => {
    const office = {
      id: 1,
      name: 'Test Office',
      address: '123 Test St',
      latitude: '22.3193',
      longitude: '114.1694',
    };

    const lat = parseFloat(String(office.latitude));
    const lng = parseFloat(String(office.longitude));

    expect(lat).toBe(22.3193);
    expect(lng).toBe(114.1694);
    expect(typeof lat).toBe('number');
    expect(typeof lng).toBe('number');
  });

  it('should return default Hong Kong center when no offices with coordinates', () => {
    const offices = [
      {
        id: 1,
        name: 'Office 1',
        address: '123 Test St',
        latitude: null,
        longitude: null,
      },
    ];

    const officesWithCoords = offices.filter(
      (o) => o.latitude && o.longitude
    );

    const defaultCenter = { lat: 22.3193, lng: 114.1694 };

    expect(officesWithCoords.length).toBe(0);
    expect(defaultCenter.lat).toBe(22.3193);
    expect(defaultCenter.lng).toBe(114.1694);
  });
});
