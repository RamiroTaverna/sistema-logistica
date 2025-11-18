import { NgIf, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShipmentPriority, ShipmentStatus } from '../../../models/shipment.model';
import { ShipmentService } from '../../../services/shipment';

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.css',
})
export class ShipmentFormComponent {
  private fb = inject(FormBuilder);
  private shipmentService = inject(ShipmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  statuses: ShipmentStatus[] = ['Pendiente', 'En transito', 'Entregado', 'Demorado', 'Cancelado'];
  priorities: ShipmentPriority[] = ['Alta', 'Media', 'Baja'];
  isEdit = false;
  shipmentId?: number;

  form = this.fb.nonNullable.group({
    trackingCode: ['', [Validators.required, Validators.minLength(5)]],
    sender: ['', [Validators.required]],
    recipient: ['', [Validators.required]],
    origin: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    status: ['Pendiente' as ShipmentStatus, Validators.required],
    priority: ['Media' as ShipmentPriority, Validators.required],
    weightKg: [1, [Validators.required, Validators.min(0.1)]],
    cost: [0, [Validators.required, Validators.min(0)]],
    createdAt: [new Date().toISOString().substring(0, 10), Validators.required],
    eta: ['', Validators.required],
    notes: [''],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.shipmentId = id;
      const shipment = this.shipmentService.getShipmentById(id);
      if (shipment) {
        this.form.patchValue(shipment);
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (this.isEdit && this.shipmentId) {
      this.shipmentService.updateShipment(this.shipmentId, value);
    } else {
      this.shipmentService.addShipment(value);
    }
    this.router.navigate(['/shipments']);
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return 'Campo obligatorio';
    }
    if (control?.hasError('minlength')) {
      return 'Muy corto';
    }
    if (control?.hasError('min')) {
      return 'Valor invalido';
    }
    return null;
  }
}
