import { OrderManagementService } from "../services/order-management.service";
import { OrderAddress } from "../../domain/entities/order-address.entity";
import { ICommand, ICommandHandler, CommandResult } from "./create-order.command";

export interface SetOrderAddressesCommand extends ICommand {
  orderId: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
}

export class SetOrderAddressesCommandHandler
  implements ICommandHandler<SetOrderAddressesCommand, CommandResult<OrderAddress>>
{
  constructor(private readonly orderService: OrderManagementService) {}

  async handle(command: SetOrderAddressesCommand): Promise<CommandResult<OrderAddress>> {
    const orderAddress = await this.orderService.setOrderAddress(
      command.orderId,
      command.billingAddress,
      command.shippingAddress,
    );
    return CommandResult.success<OrderAddress>(orderAddress);
  }
}
