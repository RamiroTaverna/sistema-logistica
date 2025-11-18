export type ShipmentStatus = 'En transito' | 'Entregado' | 'Demorado' | 'Pendiente' | 'Cancelado';
export type ShipmentPriority = 'Alta' | 'Media' | 'Baja';

export interface Shipment {
  id: number;
  trackingCode: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  weightKg: number;
  cost: number;
  createdAt: string;
  eta: string;
  notes?: string;
}
