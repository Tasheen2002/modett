import { OrderManagementService } from "../services/order-management.service";
import { OrderAddress } from "../../domain/entities/order-address.entity";
import { ICommand, ICommandHandler, CommandResult } from "./create-order.command";

export interface UpdateShippingAddressCommand extends ICommand {
  orderId: string;
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

export class UpdateShippingAddressCommandHandler
  implements ICommandHandler<UpdateShippingAddressCommand, CommandResult<OrderAddress>>
{
  constructor(private readonly orderService: OrderManagementService) {}

  async handle(command: UpdateShippingAddressCommand): Promise<CommandResult<OrderAddress>> {
    const orderAddress = await this.orderService.updateShippingAddress(
      command.orderId,
      command.shippingAddress,
    );
    return CommandResult.success<OrderAddress>(orderAddress);
  }
}
