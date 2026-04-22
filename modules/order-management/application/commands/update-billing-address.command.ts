import { OrderManagementService } from "../services/order-management.service";
import { OrderAddress } from "../../domain/entities/order-address.entity";
import { ICommand, ICommandHandler, CommandResult } from "./create-order.command";

export interface UpdateBillingAddressCommand extends ICommand {
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
}

export class UpdateBillingAddressCommandHandler
  implements ICommandHandler<UpdateBillingAddressCommand, CommandResult<OrderAddress>>
{
  constructor(private readonly orderService: OrderManagementService) {}

  async handle(command: UpdateBillingAddressCommand): Promise<CommandResult<OrderAddress>> {
    const orderAddress = await this.orderService.updateBillingAddress(
      command.orderId,
      command.billingAddress,
    );
    return CommandResult.success<OrderAddress>(orderAddress);
  }
}
