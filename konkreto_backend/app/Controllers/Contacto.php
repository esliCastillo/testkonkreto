<?php 
namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ContactoModel;

class Contacto extends ResourceController
{
    use ResponseTrait;
    // all users
    public function index(){
      $model = new ContactoModel();
      $data['contactos'] = $model->orderBy('id_contacto', 'DESC')->findAll();
      return $this->respond($data);
    }
    // create
    public function create() {
        $model = new ContactoModel();
        $data = [
            'nombres' => $this->request->getVar('nombres'),
            'apellidos'  => $this->request->getVar('apellidos'),
            'telefono'  => $this->request->getVar('telefono'),
            'correo'  => $this->request->getVar('correo'),
        ];
        $rules = [
			'nombres' => [
				'rules'  => 'required',
				'errors' => [
					'required' => 'Nombres es requerido.'
				]
			],
			'apellidos' => [
				'rules'  => 'required',
				'errors' => [
					'required' => 'Apellidos es requerido.'
				]
			],
            'correo' => [
				'rules'  => 'valid_email',
				'errors' => [
					'valid_email' => 'Verifica el correo.'
				]
			],
		];
        if (!$this->validate($rules)) {
			$errors = $this->validator->listErrors();
			return $this->failValidationError($errors);
		}
        try{
            $model->insert($data);
            $response = [
                'status'   => 201,
                'error'    => null,
                'messages' => [
                    'success' => 'Contacto creado!'
                ]
            ];
        }catch(DatabaseException $e){
            $response = [
                'status'   => 400,
                'error'    => [
                    'error' => 'Ocurio un problema! - '.$e->getMessage()
                ],
                'messages' => null
                ];
        }
        
      return $this->respondCreated($response);
    }
    // single user
    public function show($id = null){
        $model = new ContactoModel();
        $data = $model->where('id_contacto', $id)->first();
        if($data){
            return $this->respond($data);
        }else{
            return $this->failNotFound('No se encuentra el contacto');
        }
    }
    // update
    public function update($id = null){
        $model = new ContactoModel();
        //$id = $this->request->getVar('id');
        $data = [
            'nombres' => $this->request->getVar('nombres'),
            'apellidos'  => $this->request->getVar('apellidos'),
            'telefono'  => $this->request->getVar('telefono'),
            'correo'  => $this->request->getVar('correo'),
        ];
        //var_dump($id)."++++";
        //return  $this->respond($data);
        $model->update($id, $data);
        $response = [
          'status'   => 200,
          'error'    => null,
          'messages' => [
              'success' => 'Contacto Actualizado!'
          ]
      ];
      return $this->respond($response);
    }
    // delete
    public function delete($id = null){
        $model = new ContactoModel();
        $data = $model->where('id_contacto', $id)->delete($id);
        if($data){
            $model->delete($id);
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Contacto Eliminado!'
                ]
            ];
            return $this->respondDeleted($response);
        }else{
            return $this->failNotFound('Contacto no encontrado');
        }
    }
}