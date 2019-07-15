import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T,
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    public submitForm() {
        this.submittingForm = true;

        if (this.currentAction === 'new') {
        this.createResource();
        } else {
        this.updateResource();
        }
    }

    // PROTECTED METHODS
    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path === 'new') {
        this.currentAction = 'new';
        } else {
        this.currentAction = 'edit';
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
            switchMap(params => this.resourceService.getById(+params.get('id')))
            ).subscribe(
            (resource) => {
                this.resource = resource;
                this.resourceForm.patchValue(resource); // binds category data
            },
            (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
            );
        }
    }


    protected setPageTitle() {
        if (this.currentAction === 'new') {
            this.pageTitle = this.creationPageTitle();
        } else {
            this.pageTitle = this.editingPageTitle();
        }
    }

    protected creationPageTitle() {
        return 'Novo';
    }

    protected editingPageTitle() {
        return 'Edição';
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
        this.resourceService.create(resource)
        .subscribe(
            resourceSub => this.actionsForSuccess(resourceSub),
            error => this.actionsForError(error)
        )
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.update(resource)
        .subscribe(
        resourceSub => this.actionsForSuccess(resourceSub),
        error => this.actionsForError(error)
        );
    }

    protected actionsForSuccess(resource: T) {
        toastr.success('Solicitação processada com sucesso!');

        const baseResourcePath: string = this.route.snapshot.parent.url[0].path;

        // redirect/reload on the component
        this.router.navigateByUrl(baseResourcePath, {skipLocationChange: true})
        .then(
        () => this.router.navigate([baseResourcePath, resource.id, 'edit']),
        );
    }

    protected actionsForError(error) {
        toastr.error('Ocorreu um erro ao processar a sua solicitação!');

        this.submittingForm = false;

        if (error.status === 422) {
        this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
        this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
        }

    }

    protected abstract buildResourceForm(): void;

}
