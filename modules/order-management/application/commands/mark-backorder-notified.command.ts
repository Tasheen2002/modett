import { BackorderManagementService } from '../services/backorder-management.service';
import { Backorder } from '../../domain/entities/backorder.entity';
import { ICommand, ICommandHandler, CommandResult } from './create-backorder.command';

export interface MarkBackorderNotifiedCommand extends ICommand {
  orderItemId: string;
}

export class MarkBackorderNotifiedCommandHandler
  implements ICommandHandler<MarkBackorderNotifiedCommand, CommandResult<Backorder | null>>
{
  constructor(private readonly backorderService: BackorderManagementService) {}

  async handle(command: MarkBackorderNotifiedCommand): Promise<CommandResult<Backorder | null>> {
    const backorder = await this.backorderService.markAsNotified(command.orderItemId);
    return CommandResult.success(backorder);
  }
}
