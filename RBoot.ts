

namespace leojs
{

    export const EntryPointFiles : string[] = 
    [
        // cat1js lib *****************************************
        'ext/cat1js/core/math/LMath.js',
        'ext/cat1js/core/data/LVertexBuffer.js',
        'ext/cat1js/core/data/LIndexBuffer.js',
        'ext/cat1js/core/data/LTexture.js',
        'ext/cat1js/core/shader/LShader.js',
        'ext/cat1js/core/assets/LShadersManager.js',
        'ext/cat1js/core/assets/LTexturesManager.js',
        'ext/cat1js/core/assets/LAssetsManager.js',
        'ext/cat1js/core/material/LBaseMaterial.js',
        'ext/cat1js/core/geometry/LBaseGeometry.js',
        'ext/cat1js/core/graphics/LIRenderable.js',
        'ext/cat1js/core/graphics/LBaseMesh.js',
        'ext/cat1js/core/lights/LBaseLight.js',
        'ext/cat1js/core/camera/LBaseCamera.js',
        'ext/cat1js/core/scene/LScene.js',
        'ext/cat1js/engine3d/geometry/LGeometry3d.js',
        'ext/cat1js/engine3d/geometry/LGeometryBuilder.js',
        'ext/cat1js/engine3d/material/LMaterial3d.js',
        'ext/cat1js/engine3d/material/LPhongMaterial.js',
        'ext/cat1js/engine3d/material/LTexturedMaterial.js',
        'ext/cat1js/engine3d/graphics/LMesh.js',
        'ext/cat1js/engine3d/lights/LLight3d.js',
        'ext/cat1js/engine3d/lights/LDirectionalLight.js',
        'ext/cat1js/engine3d/lights/LPointLight.js',
        'ext/cat1js/engine3d/camera/LFixedPointCamera.js',
        'ext/cat1js/engine3d/camera/LFixedDirectionCamera.js',
        'ext/cat1js/engine3d/shaders/LShaderBasic3d.js',
        'ext/cat1js/engine3d/shaders/LShaderPhongLighting.js',
        'ext/cat1js/engine3d/shaders/LShaderDebugDrawer3d.js',
        'ext/cat1js/engine3d/shaders/LShaderSimpleTexture.js',
        'ext/cat1js/engine3d/shaders/LShaderTextureLighting.js',
        'ext/cat1js/engine3d/debug/LDebugSystem.js',
        'ext/cat1js/engine3d/debug/LDebugDrawer.js',
        'ext/cat1js/engine3d/renderers/LMeshRenderer.js',
        'ext/cat1js/core/renderer/LMasterRenderer.js',
        'ext/cat1js/core/LInputHandler.js',
        'ext/cat1js/core/LApplicationData.js',
        'ext/cat1js/core/LApplication.js',
        'ext/cat1js/Globals.js',
        // ****************************************************
        // leojs **********************************************
        'core/RCommon.js',
        'core/components/RComponent.js',
        'core/components/graphics/RGraphicsComponent.js',
        'core/components/graphics/RMesh3dComponent.js',
        'core/components/graphics/RGraphicsFactory.js',
        'core/components/graphics/RReferenceFrameComponent.js',
        'core/components/RTestComponent.js',
        'core/entities/REntity.js',
        'core/entities/RTestEntity.js',
        'core/worlds/RWorld.js',
        // robo - dh functionality --------
        'robo/dh/RDHcommon.js',
        'robo/dh/components/RDHendEffectorComponent.js',
        'robo/dh/components/RDHjointPrismaticComponent.js',
        'robo/dh/components/RDHjointRevoluteComponent.js',
        'robo/dh/RDHmodel.js',
        'robo/dh/models/RDHmodelScara.js',
        'robo/dh/models/RDHmodelKukaKR210.js',
        'robo/dh/ui/RDHguiController.js',
        'robo/dh/RDHWorld.js',
        // --------------------------------
        'core/RApp.js',
        'main.js'
        // ****************************************************
    ];


}