import { PreorderManagementService } from '../services/preorder-management.service';
import { Preorder } from '../../domain/entities/preorder.entity';
import { ICommand, ICommandHandler, CommandResult } from './create-preorder.command';

export interface UpdatePreorderReleaseDateCommand extends ICommand {
  orderItemId: string;
  releaseDate: Date;
}

export class UpdatePreorderReleaseDateCommandHandler
  implements ICommandHandler<UpdatePreorderReleaseDateCommand, CommandResult<Preorder | null>>
{
  constructor(private readonly preorderService: PreorderManagementService) {}

  async handle(command: UpdatePreorderReleaseDateCommand): Promise<CommandResult<Preorder | null>> {
    const preorder = await this.preorderService.updateReleaseDate(
      command.orderItemId,
      command.releaseDate,
    );
    return CommandResult.success(preorder);
  }
}
