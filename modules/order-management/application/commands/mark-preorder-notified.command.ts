import { PreorderManagementService } from '../services/preorder-management.service';
import { Preorder } from '../../domain/entities/preorder.entity';
import { ICommand, ICommandHandler, CommandResult } from './create-preorder.command';

export interface MarkPreorderNotifiedCommand extends ICommand {
  orderItemId: string;
}

export class MarkPreorderNotifiedCommandHandler
  implements ICommandHandler<MarkPreorderNotifiedCommand, CommandResult<Preorder | null>>
{
  constructor(private readonly preorderService: PreorderManagementService) {}

  async handle(command: MarkPreorderNotifiedCommand): Promise<CommandResult<Preorder | null>> {
    const preorder = await this.preorderService.markAsNotified(command.orderItemId);
    return CommandResult.success(preorder);
  }
}
