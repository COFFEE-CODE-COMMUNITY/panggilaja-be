import serviceItemService from "../services/serviceItemService.js";

// const getServices = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const songs = await songService.getPlaylist(userId);

//     return res.status(200).json({
//       success: true,
//       message: "Data didalam playlist anda!",
//       data: songs,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getServiceById = async (req, res, next) => {
//   try {
//     const validate = await songSchema.getSongById.validateAsync(req.params);

//     if (!validate) {
//       throw {
//         code: 400,
//         message: validate.error.details.map((d) => d.message),
//       };
//     }

//     const id = validate.id;
//     const result = await songService.getSongById(id, req.user.id);

//     return res.status(200).json({
//       success: true,
//       message: `Lagu dengan id ${id} berhasil ditemukan!`,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const addService = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await serviceItemService.addService(request);
    res.status(201).json({
      success: true,
      message: "Service added successfully!",
      data: result, // bisa dikembalikan langsung hasil servicenya
    });
  } catch (error) {
    next(error);
  }
};

// const updateServiceById = async (req, res, next) => {
//   try {
//     const data = {
//       id: req.params.id,
//       title: req.body.title,
//       artists: req.body.artists,
//       url: req.body.url,
//     };

//     const validate = await songSchema.updateSong.validateAsync(data, {
//       abortEarly: false,
//     });

//     const result = await songService.updateSongById(validate, req.user.id);

//     if (!result) {
//       throw {
//         code: 400,
//         message: `Lagu gagal diperbarui: ${result.message}`,
//       };
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Lagu dengan id ${validate.id} berhasil diperbarui!`,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteServiceById = async (req, res, next) => {
//   try {
//     const validate = await songSchema.deleteSong.validateAsync(req.params);
//     const id = validate.id;
//     const result = await songService.deleteSongById(id, req.user.id);

//     if (!result) {
//       throw {
//         code: 400,
//         message: `Lagu gagal dihapus: ${result.message}`,
//       };
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Lagu dengan id ${id} berhasil dihapus!`,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export default {
  // getServices,
  // getServiceById,
  addService,
  // updateServiceById,
  // deleteServiceById,
};
