import {Component, OnInit} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {NzTreeFlatDataSource, NzTreeFlattener} from 'ng-zorro-antd/tree-view';
import {Actions, FlatNode, TreeNode} from '../../../../shared/models/Menu.inteface';
import {Result} from '../../../../shared/models/result.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService} from '../../../../shared/service/roles/role.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-create-profile',
    templateUrl: './create-profile.component.html',
    styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
    TREE_DATA: TreeNode[] = [];
    nameRole: string = '';
    selectedNodes: TreeNode[] = [];
    idRole: number = 0;
    actions: Actions[] = [];
    actionSave: number[] = [];
    menuSave: number [] = [];

    constructor(private apiRole: RoleService,
                private activatedRoute: ActivatedRoute,
                private toastr: ToastrService,
                private  route:Router) {

    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.idRole = params['id'];
        });
        this.getList();
    }

    getList() {
        let idRole: number = this.idRole ?? 0;

        this.apiRole.getListMenuActionRole(idRole).subscribe((resp: Result) => {
            console.log(resp);
            this.actionSave = []
            this.TREE_DATA = resp.payload.data.menus;
            this.nameRole = resp.payload.data.name;
            this.actions = resp.payload.data.actions;
            for (let item of this.actions){
                if (item.checked){
                    this.actionSave.push(Number(item.id));
                }

            }
            this.dataSource.setData(this.TREE_DATA);
            this.initializeCheckState(this.TREE_DATA);
        });
    }

    flatNodeMap = new Map<FlatNode, TreeNode>();
    nestedNodeMap = new Map<TreeNode, FlatNode>();
    checklistSelection = new SelectionModel<FlatNode>(true);

    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level,
        node => node.expandable
    );
    transformer = (node: TreeNode, level: number): FlatNode => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.name === node.name
                ? existingNode
                : {
                    expandable: !!node.children && node.children.length > 0,
                    name: node.name,
                    level,
                    disabled: !!node.disabled,
                    checked: !!node.checked,
                };
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    treeFlattener = new NzTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children
    );
    dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
    hasChild = (_: number, node: FlatNode): boolean => node.expandable;

    descendantsAllSelected(node: FlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    }

    descendantsPartiallySelected(node: FlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    leafItemSelectionToggle(node: FlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    itemSelectionToggle(node: FlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    checkAllParentsSelection(node: FlatNode): void {
        let parent: FlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    checkRootNodeSelection(node: FlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    getParentNode(node: FlatNode): FlatNode | null {
        const currentLevel = node.level;

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    initializeCheckState(nodes: TreeNode[]): void {
        nodes.forEach(node => {
            if (node.checked) {
                const flatNode = this.nestedNodeMap.get(node);
                if (flatNode) {
                    this.checklistSelection.select(flatNode);
                }
            }
            if (node.children) {
                this.initializeCheckState(node.children);
            }
        });
    }

    getSelectedNodes(): TreeNode[] {
        const collectSelectedNodes = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(node => {
                const flatNode = this.nestedNodeMap.get(node);
                const isSelected = this.checklistSelection.isSelected(flatNode);
                const children = node.children ? collectSelectedNodes(node.children) : [];
                return {
                    ...node,
                    checked: isSelected,
                    children: children.length ? children : undefined,
                };
            }).filter(node => node.checked || (node.children && node.children.length));
        };

        return collectSelectedNodes(this.TREE_DATA);
    }

    onChangeAction(event) {
        console.log(event.target.checked, event.target.id);
        const ids = Number(event.target.id);
        if (event.target.checked) {
            this.actionSave.push(ids);
        } else {
            this.actionSave = this.actionSave.filter(item => item !== ids);

        }
    }

    onSave() {
        this.selectedNodes = this.getSelectedNodes();
        console.log('Selected Nodes:', this.selectedNodes);
        this.menuSave = [];
        const checkNode = (node) => {
            if (node.checked) {
                this.menuSave.push(node['id']);
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => checkNode(child));
            }
        };

        this.selectedNodes.forEach(item => checkNode(item));
        console.log('Selected menu:', this.menuSave);
        console.log('selectd action:', this.actionSave);
        if (this.menuSave.length == 0) {
            this.toastr.info('Seleccione un menu', '¡Advertencia!');
            return;
        }
        if (this.actionSave.length == 0) {
            this.toastr.info('Seleccione una acción', '¡Advertencia!');
            return;
        }

        let data = {
            id: this.idRole,
            roleName: this.nameRole,
            menus: this.menuSave,
            actions: this.actionSave,
        };
        const saveOperation = this.idRole
            ? this.apiRole.putRole(this.idRole, data)
            : this.apiRole.postRole(data);

        saveOperation.subscribe({
            next: (res: Result) => this.handleSuccess(res),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(res: Result) {
        console.log(res);
        Swal.fire({
            title: 'Éxito!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                if (this.idRole){
                    this.getList();
                    return;
                }
                this.route.navigate(['/settings/profile'])
            }
        });
    }

    handleError(err: any) {
        console.error(err);
        Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al guardar el rol.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
        });
    }
}
