import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import { MissingFieldError } from "../../../../core/presentation/errors/missing-field-error";
import { failureResponse, successResponse } from "../../../../core/presentation/helpers/http-handler";
import { IViewNoteParams, ViewNoteUseCase } from "../../domain/usecases/view-note-usecase";

export class ViewNoteController implements Controller {
    constructor (private viewNoteUseCase: ViewNoteUseCase) { };

    async execute(req: Request, res: Response): Promise<any> {
        try {
            const useCaseData: IViewNoteParams = {
                userid: res.locals.userid as number,
                noteUid: req.params.uid
            };

            if (!useCaseData.userid) {
                throw new MissingFieldError("userid");
            }

            const result = await this.viewNoteUseCase.run(useCaseData);
            successResponse(res, "NoteView", result);
        }
        catch (error) {
            failureResponse(res, error);
        }
    }
}