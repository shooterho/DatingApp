using System;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService : IPhotoService
{
    Cloudinary cloudinary;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        Account acc = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
        cloudinary = new Cloudinary(acc);
    }

    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 1)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "da-net9"
            };
            uploadResult = await cloudinary.UploadAsync(uploadParams);
        }
        return uploadResult;


    }

    public async Task<DeletionResult> DeletePhotoAsync(string id)
    {
        var deletionParams = new DeletionParams(id);
        var deletionResult = await cloudinary.DestroyAsync(deletionParams);
        return deletionResult;
    }
}
