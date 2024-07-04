const { request, response } = require('express');
const Reserve=require('../models/reserve')
const addReserve=async(request,response)=>{
    try {
        // name":data.name,
        //                 "telephone":data.telefono,
        //                 "participants":data.participantes,
        //                 "email":data.email,
        //                 "date":data.date,
        //                 "hora":data.time
        //                  "id"
        const { name,telephone,participants,email,date,hora ,id} = request.body;
        const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return response.status(400).json({ message: 'El correo no es correcto' });
    }
    const newReserv = new Reserve({ name, telephone,participants,email, date,hora});
    await newUser.save();
    response.status(201).json({ message: 'Reserva registrada con éxito', user: { name, telephone, participants, email,date,hora } });
    } catch (error) {
        response.status(500).json({ message: 'Error al registrar el usuario', error: error.message });

    }
}
const getAllReservs=async(request,response)=>{
    try {
        const Reserv=await Reserve.find({});
        response.status(200).json(Reserv)
    } catch (error) {
        response.status(500).json(error)
    }

}
// Actualizar un usuario
const updateReserv = async (request, response) => {
    try {
      const { id } = request.params;
      const { name,telephone,participants,email,date,hora} = request.body;
  
      // Actualizar el usuario por ID
      const updatedReserv = await User.findByIdAndUpdate(id, {name,telephone,participants,email,date,hora }, { new: true });
      if (!updatedReserv) {
        return response.status(404).json({ message: 'Error al editar reserva' });
      }
  
      response.status(200).json({ message: 'Reserva actualizada con éxito', user: updatedReserv });
    } catch (error) {
      response.status(500).json({ message: 'Error al actualizar la reserva', error: error.message });
    }
  };
  const deleteReserv = async (request, response) => {
    try {
      const { id } = request.params;
  
      // Eliminar el usuario por ID
      const deletedReserv = await Reserv.findByIdAndDelete(id);
      if (!deletedReserv) {
        return response.status(404).json({ message: 'Reserva no encontrada' });
      }
  
      response.status(200).json({ message: 'Reserva eliminada con éxito' });
    } catch (error) {
      response.status(500).json({ message: 'Error al eliminar la reserva', error: error.message });
    }
  };
module.exports={getAllReservs,addReserve,updateReserv,deleteReserv}