import { BackorderManagementService } from '../services/backorder-management.service';
import { Backorder } from '../../domain/entities/backorder.entity';
import { ICommand, ICommandHandler, CommandResult } from './create-backorder.command';

export interface UpdateBackorderEtaCommand extends ICommand {
  orderItemId: string;
  promisedEta: Date;
}

export class UpdateBackorderEtaCommandHandler
  implements ICommandHandler<UpdateBackorderEtaCommand, CommandResult<Backorder | null>>
{
  constructor(private readonly backorderService: BackorderManagementService) {}

  async handle(command: UpdateBackorderEtaCommand): Promise<CommandResult<Backorder | null>> {
    const backorder = await this.backorderService.updatePromisedEta(
      command.orderItemId,
      command.promisedEta,
    );
    return CommandResult.success(backorder);
  }
}
