import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deliveryFormSchema,
  type DeliveryFormData,
} from "../../validations/order";
import "../../styles/checkout/deliveryForm.css";
import Spinner from "../common/Spinner";

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  isCreating: boolean;
}

export default function DeliveryForm({
  onSubmit,
  isCreating,
}: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryFormSchema),
    mode: "onChange",
  });

  return (
    <form
      className="delivery-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isCreating}
    >
      <h2 className="delivery-form-title">Delivery Details</h2>

      <div className="delivery-form-field">
        <label htmlFor="name" className="delivery-form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          aria-invalid={!!errors.name}
          className={`delivery-form-input ${errors.name ? "delivery-form-input-error" : ""}`}
          {...register("name")}
        />
        {errors.name && (
          <p className="delivery-form-error">{errors.name.message}</p>
        )}
      </div>

      <div className="delivery-form-field">
        <label htmlFor="address" className="delivery-form-label">
          Address
        </label>
        <textarea
          id="address"
          rows={3}
          placeholder="123 Main St, Apt 4B, Springfield"
          aria-invalid={!!errors.address}
          className={`delivery-form-textarea ${errors.address ? "delivery-form-input-error" : ""}`}
          {...register("address")}
        />
        {errors.address && (
          <p className="delivery-form-error">{errors.address.message}</p>
        )}
      </div>

      <div className="delivery-form-field">
        <label htmlFor="phone" className="delivery-form-label">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+1 555-123-4567"
          aria-invalid={!!errors.phone}
          className={`delivery-form-input ${errors.phone ? "delivery-form-input-error" : ""}`}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="delivery-form-error">{errors.phone.message}</p>
        )}
      </div>

      <div className="delivery-form-field">
        <label htmlFor="notes" className="delivery-form-label">
          Delivery Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          placeholder="Ring the doorbell, leave at the door..."
          aria-invalid={!!errors.notes}
          className={`delivery-form-textarea ${errors.notes ? "delivery-form-input-error" : ""}`}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="delivery-form-error">{errors.notes.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="delivery-form-submit"
        disabled={isCreating}
      >
        {isCreating ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}
