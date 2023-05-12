<?php 
namespace App\Models;
use CodeIgniter\Model;
class ContactoModel extends Model
{
    protected $table = 'contactos';
    protected $primaryKey = 'id_contacto';
    protected $allowedFields = ['nombres','apellidos','telefono', 'correo','foto'];
    protected $validation;
    $this->validation =  \Config\Services::validation();
    public function __construct(){
        // load the validation service
	    $this->validation =  \Config\Services::validation();
    }
}