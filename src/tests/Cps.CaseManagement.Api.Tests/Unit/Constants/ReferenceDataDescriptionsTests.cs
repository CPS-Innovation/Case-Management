namespace Cps.CaseManagement.Api.Tests.Unit.Constants;

using AutoFixture;
using Cps.CaseManagement.Api.Constants;

public class ReferenceDataDescriptionsTests
{
    private readonly Fixture _fixture;

    public ReferenceDataDescriptionsTests()
    {
        _fixture = new Fixture();
    }

    [Theory]
    [InlineData("Dr", "Doctor")]
    [InlineData("Miss", "Miss")]
    [InlineData("Mr", "Mister")]
    [InlineData("Mrs", "Missus")]
    [InlineData("Ms", "Ms")]
    [InlineData("Prof", "Professor")]
    [InlineData("Rev", "Reverend")]
    [InlineData("PC", "Police Constable")]
    [InlineData("DC", "Detective Constable")]
    [InlineData("PS", "Police Sergeant")]
    [InlineData("DS", "Detective Sergeant")]
    [InlineData("INS", "Inspector")]
    [InlineData("DI", "Detective Inspector")]
    [InlineData("PCSO", "Police Community Support Officer")]
    [InlineData("CI", "Chief Inspector")]
    [InlineData("SC", "Special Constable")]
    public void GetTitleDescription_WithValidCode_ReturnsCorrectDescription(string code, string expectedDescription)
    {
        // Act
        var result = ReferenceDataDescriptions.GetTitleDescription(code);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Theory]
    [InlineData("dr", "Doctor")]
    [InlineData("DR", "Doctor")]
    [InlineData("Mr", "Mister")]
    [InlineData("MR", "Mister")]
    [InlineData("mr", "Mister")]
    public void GetTitleDescription_IsCaseInsensitive(string code, string expectedDescription)
    {
        // Act
        var result = ReferenceDataDescriptions.GetTitleDescription(code);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Fact]
    public void GetTitleDescription_WithUnknownCode_ReturnsCode()
    {
        // Arrange
        var unknownCode = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetTitleDescription(unknownCode);

        // Assert
        Assert.Equal(unknownCode, result);
    }

    [Theory]
    [InlineData("Dr", "Doctor (Dr)")]
    [InlineData("Mr", "Mister (Mr)")]
    [InlineData("Prof", "Professor (Prof)")]
    [InlineData("PC", "Police Constable (PC)")]
    public void GetTitleDisplayName_WithValidCode_ReturnsDescriptionWithCode(string code, string expected)
    {
        // Act
        var result = ReferenceDataDescriptions.GetTitleDisplayName(code);

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("dr", "Doctor (dr)")]
    [InlineData("DR", "Doctor (DR)")]
    [InlineData("MR", "Mister (MR)")]
    public void GetTitleDisplayName_PreservesOriginalCodeCasing(string code, string expected)
    {
        // Act
        var result = ReferenceDataDescriptions.GetTitleDisplayName(code);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void GetTitleDisplayName_WithUnknownCode_ReturnsCodeOnly()
    {
        // Arrange
        var unknownCode = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetTitleDisplayName(unknownCode);

        // Assert
        Assert.Equal(unknownCode, result);
    }

    [Theory]
    [InlineData("BP", "Both prolific priority offender (PPO) and prolific youth offender (PYO)")]
    [InlineData("PP", "Prolific priority offender (PPO)")]
    [InlineData("PY", "Prolific youth offender (PYO)")]
    [InlineData("YO", "Youth offender (YO)")]
    [InlineData("UN", "Unspecified")]
    public void GetOffenderCategoryDisplay_WithValidCode_ReturnsCorrectDescription(string code, string expectedDescription)
    {
        // Act
        var result = ReferenceDataDescriptions.GetOffenderCategoryDisplay(code);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Theory]
    [InlineData("bp", "Both prolific priority offender (PPO) and prolific youth offender (PYO)")]
    [InlineData("BP", "Both prolific priority offender (PPO) and prolific youth offender (PYO)")]
    [InlineData("Bp", "Both prolific priority offender (PPO) and prolific youth offender (PYO)")]
    public void GetOffenderCategoryDisplay_IsCaseInsensitive(string code, string expectedDescription)
    {
        // Act
        var result = ReferenceDataDescriptions.GetOffenderCategoryDisplay(code);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Fact]
    public void GetOffenderCategoryDisplay_WithUnknownCode_ReturnsCode()
    {
        // Arrange
        var unknownCode = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetOffenderCategoryDisplay(unknownCode);

        // Assert
        Assert.Equal(unknownCode, result);
    }

    [Theory]
    [InlineData("CAOP", "Crime Against an Older Person")]
    [InlineData("NFS", "Non Fatal Strangulation/Suffocation")]
    [InlineData("POFC", "Proceeds of Crime Statistics")]
    [InlineData("RTCC", "Real Time Case Conversation")]
    [InlineData("SUCA", "Substantial Charge Alteration")]
    [InlineData("VIVM", "Vulnerable/Intimidated victim or witness")]
    public void GetMonitoringCodeDisplay_WithValidCode_ReturnsCorrectDescription(string code, string expectedDescription)
    {
        // Arrange
        var defaultDescription = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetMonitoringCodeDisplay(code, defaultDescription);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Theory]
    [InlineData("caop", "Crime Against an Older Person")]
    [InlineData("CAOP", "Crime Against an Older Person")]
    [InlineData("Caop", "Crime Against an Older Person")]
    public void GetMonitoringCodeDisplay_IsCaseInsensitive(string code, string expectedDescription)
    {
        // Arrange
        var defaultDescription = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetMonitoringCodeDisplay(code, defaultDescription);

        // Assert
        Assert.Equal(expectedDescription, result);
    }

    [Fact]
    public void GetMonitoringCodeDisplay_WithUnknownCode_ReturnsFallbackDescription()
    {
        // Arrange
        var unknownCode = _fixture.Create<string>();
        var fallbackDescription = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetMonitoringCodeDisplay(unknownCode, fallbackDescription);

        // Assert
        Assert.Equal(fallbackDescription, result);
    }

    [Fact]
    public void GetMonitoringCodeDisplay_WithValidCode_DoesNotUseFallback()
    {
        // Arrange
        var validCode = "CAOP";
        var fallbackDescription = _fixture.Create<string>();

        // Act
        var result = ReferenceDataDescriptions.GetMonitoringCodeDisplay(validCode, fallbackDescription);

        // Assert
        Assert.NotEqual(fallbackDescription, result);
        Assert.Equal("Crime Against an Older Person", result);
    }
}